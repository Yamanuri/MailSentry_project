import re

def extract_entities(text):
    """
    Extract structured information using regex.
    Email IDs, phone numbers, Invoice IDs, Ticket IDs, Monetary values, Order IDs.
    """
    entities = {
        "phone_number": r"\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
        "email_address": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "invoice_id": r"\bINV-[A-Z0-9]{4,8}\b|\bINV\d{6,}\b",
        "ticket_id": r"\bTCK-[A-Z0-9]{4,8}\b|\bTKT\d{6,}\b",
        "amount": r"[\$₹]\s?\d+(?:,\d{3})*(?:\.\d{2})?\b",
        "order_id": r"\bORD-\d{6,12}\b|\bORD[A-Z0-9]{10}\b"
    }
    
    results = {}
    for key, pattern in entities.items():
        matches = re.findall(pattern, text)
        if matches:
            if isinstance(matches[0], tuple):
                results[key] = matches[0][0]
            else:
                results[key] = matches[0]
        else:
            results[key] = "N/A"
            
    return results
