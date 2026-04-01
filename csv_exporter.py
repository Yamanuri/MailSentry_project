import pandas as pd
import os

def export_to_csv(emails, entities, output_dir):
    """
    Generate structured CSV files for reporting.
    - processed_emails.csv
    - extracted_entities.csv
    """
    # 1. Prepare data for processed_emails.csv
    processed_emails = []
    for email in emails:
        processed_emails.append({
            "email_id": email["email_id"],
            "sender": email["sender"],
            "subject": email["subject"],
            "date": email["date"],
            "category": email.get("category", "Unclassified"),
            "body_preview": email.get("cleaned_body", "")[:100] + "..."
        })
        
    df_emails = pd.DataFrame(processed_emails)
    emails_file = os.path.join(output_dir, "processed_emails.csv")
    df_emails.to_csv(emails_file, index=False)
    print(f"Exported {len(processed_emails)} emails to {emails_file}")
    
    # 2. Prepare data for extracted_entities.csv
    extracted_entities = []
    for email_id, entity_results in entities.items():
        row = {"email_id": email_id}
        row.update(entity_results)
        extracted_entities.append(row)
        
    df_entities = pd.DataFrame(extracted_entities)
    entities_file = os.path.join(output_dir, "extracted_entities.csv")
    df_entities.to_csv(entities_file, index=False)
    print(f"Exported entities for {len(extracted_entities)} emails to {entities_file}")
    
    return emails_file, entities_file
