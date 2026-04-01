import matplotlib.pyplot as plt
import pandas as pd
import os

def generate_analytics(emails_file, output_dir):
    """
    Generate analytics visual graphs using matplotlib.
    """
    if not os.path.exists(emails_file):
        print(f"Error: {emails_file} not found. Cannot generate analytics.")
        return
        
    df = pd.read_csv(emails_file)
    if df.empty:
        print("No data found in emails file. Skipping analytics graphs.")
        return
    
    # 1. Pie Chart – Category Distribution
    plt.figure(figsize=(10, 6))
    category_counts = df["category"].value_counts()
    plt.pie(category_counts, labels=category_counts.index, autopct="%1.1f%%", startangle=140, colors=plt.cm.Paired.colors)
    plt.title("Email Category Distribution")
    plt.savefig(os.path.join(output_dir, "category_distribution.png"))
    plt.close()
    
    # 2. Bar Chart – Top 5 Senders
    plt.figure(figsize=(10, 6))
    top_senders = df["sender"].value_counts().head(5)
    top_senders.plot(kind="bar", color="skyblue")
    plt.title("Top 5 Email Senders")
    plt.ylabel("Count")
    plt.xlabel("Sender")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "top_senders.png"))
    plt.close()
    
    # 3. Line Graph – Emails Per Day
    try:
        df["date"] = pd.to_datetime(df["date"], errors="coerce", utc=True)
        # Filter out NaT
        df_valid = df[df["date"].notna()]
        if not df_valid.empty:
            daily_counts = df_valid.groupby(df_valid["date"].dt.date).size()
            plt.figure(figsize=(10, 6))
            daily_counts.plot(kind="line", marker="o", color="green")
            plt.title("Daily Email Volume")
            plt.ylabel("Volume")
            plt.xlabel("Date")
            plt.grid(True)
            plt.savefig(os.path.join(output_dir, "daily_volume.png"))
            plt.close()
    except Exception as e:
        print(f"Error generating daily volume graph: {e}")
    
    print(f"Generated analytics PNGs in {output_dir}")
