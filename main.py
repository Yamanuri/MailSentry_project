import json
import os
import sys
from gmail_connector import connect_gmail, disconnect_gmail
from email_fetcher import fetch_latest_emails
from text_cleaner import clean_text
from classifier import classify_email
from parser import extract_entities
from csv_exporter import export_to_csv
from analytics_dashboard import generate_analytics

def main():
    """
    Main orchestration function for MailSentry Insight™ (Consolidated Version).
    """
    # 1. Load configuration
    config_path = "config.json"
    if not os.path.exists(config_path):
        print(f"Error: {config_path} not found.")
        return

    try:
        with open(config_path, "r") as f:
            config = json.load(f)

        user = config.get("email")
        password = config.get("app_password")
        n_emails = config.get("n_emails", 50)
        output_dir = config.get("output_dir", "output")

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # 2. Connect to Gmail
        mail = connect_gmail(user, password)
        if not mail:
            print("Failed to authenticate. Exiting.")
            return

        try:
            # 3. Retrieve Emails
            raw_emails = fetch_latest_emails(mail, n_emails)
            if not raw_emails:
                print("No emails retrieved.")
                return

            print(f"Successfully retrieved {len(raw_emails)} emails.")

            # 4. Processing Layer
            # Process each email (Clean, Classify, Parse)
            processed_emails = []
            extracted_data_map = {}

            for email_data in raw_emails:
                # A. Clean text
                cleaned_body = clean_text(email_data["body"])
                email_data["cleaned_body"] = cleaned_body

                # B. Classify email
                category = classify_email(cleaned_body)
                email_data["category"] = category

                # C. Extract entities
                entities = extract_entities(cleaned_body)
                extracted_data_map[email_data["email_id"]] = entities

                processed_emails.append(email_data)

            # 5. Export Layer
            print("Exporting data to CSV...")
            emails_file, entities_file = export_to_csv(processed_emails, extracted_data_map, output_dir)

            # 6. Analytics Layer
            print("Generating analytics dashboard...")
            generate_analytics(emails_file, output_dir)

            print("\n" + "="*50)
            print("MailSentry Insight™ | Intelligence Engine")
            print("="*50)
            print(f"✔️  Data exported to: {output_dir}")
            print(f"✔️  Live Dashboard: index.html")
            print("="*50)
            print("Open index.html in your browser to view your insights!")
            print("="*50 + "\n")

        finally:
            # 7. Disconnect securely
            disconnect_gmail(mail)

    except Exception as e:
        print(f"An unexpected error occurred during processing: {e}")

if __name__ == "__main__":
    main()
