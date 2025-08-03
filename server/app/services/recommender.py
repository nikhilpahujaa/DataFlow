import os

class Recommender:
    def __init__(self, analysis):
        self.analysis = analysis

    def recommend(self):
        tables = self.analysis.get('tables', [])
        relationships = self.analysis.get('relationships', [])
        if not tables:
            return {
                "recommendation": "postgresql",
                "explanation": "No tables found, defaulting to PostgreSQL."
            }

        rel_ratio = len(relationships) / len(tables) if tables else 0

        # If schema is highly relational, prefer PostgreSQL
        if rel_ratio > 0.3:
            # Check if schema uses advanced types
            uses_advanced_types = False
            for table in tables:
                for col in table['columns']:
                    if col['type'] in ('CLOB', 'BLOB', 'LONG', 'RAW', 'LONG RAW', 'JSON', 'ARRAY', 'OBJECT'):
                        uses_advanced_types = True
            
            # Always recommend PostgreSQL for highly relational schemas
            if uses_advanced_types:
                return {
                    "recommendation": "postgresql",
                    "explanation": f"Schema is highly relational but uses advanced types (e.g., JSON, arrays, objects), so PostgreSQL is a better fit."
                }
            else:
                return {
                    "recommendation": "postgresql",
                    "explanation": f"Schema is highly relational ({len(relationships)} relationships for {len(tables)} tables). PostgreSQL is a good fit."
                }

        # If many columns are CLOB/BLOB/JSON, prefer MongoDB
        for table in tables:
            for col in table['columns']:
                if col['type'] in ('CLOB', 'BLOB', 'LONG', 'RAW', 'LONG RAW', 'JSON'):
                    return {
                        "recommendation": "mongodb",
                        "explanation": f"Table {table['name']} has unstructured or large object columns ({col['type']})."
                    }

        # Default: MongoDB for flat/denormalized, PostgreSQL for relational
        if rel_ratio > 0.1:
            # Check for advanced types
            uses_advanced_types = False
            for table in tables:
                for col in table['columns']:
                    if col['type'] in ('CLOB', 'BLOB', 'LONG', 'RAW', 'LONG RAW', 'JSON', 'ARRAY', 'OBJECT'):
                        uses_advanced_types = True
            
            # Always recommend PostgreSQL for schemas with relationships
            if uses_advanced_types:
                return {
                    "recommendation": "postgresql",
                    "explanation": f"Some relationships detected ({len(relationships)}), and schema uses advanced types, so PostgreSQL is a better fit."
                }
            else:
                return {
                    "recommendation": "postgresql",
                    "explanation": f"Some relationships detected ({len(relationships)}). PostgreSQL is a good fit."
                }
        else:
            return {
                "recommendation": "mongodb",
                "explanation": "Few relationships and no large object columns detected, so MongoDB is a good fit."
            }