import re

def classify_email(text):
    """
    Classify email into categories (Sales Lead, Support, Invoice, HR, Internal, Spam).
    Method: Keyword-based weighted scoring system.
    """
    categories = {
        "Sales Lead": ["pricing", "quote", "interested", "proposal", "buying", "cost", "demo", "request"],
        "Support": ["issue", "error", "problem", "bug", "not working", "help", "ticket", "crash", "failed"],
        "Invoice": ["invoice", "payment", "billing", "receipt", "due", "transaction", "amount", "charge"],
        "HR": ["resume", "application", "hiring", "interview", "job", "career", "salary", "offer"],
        "Internal": ["meeting", "standup", "internal", "announcement", "office", "reminder", "sync"],
        "Spam": ["win", "lottery", "prize", "congratulations", "offer", "free", "discount", "promotion"]
    }
    
    scores = {cat: 0 for cat in categories}
    
    # Analyze text
    for cat, keywords in categories.items():
        for keyword in keywords:
            if keyword in text.lower():
                scores[cat] += 1
                
    # Select the category with the highest score
    best_cat = max(scores, key=scores.get)
    
    # If no keywords matched, default to 'Internal'
    if scores[best_cat] == 0:
        return "Internal"
        
    return best_cat
