import re
import html

def clean_text(text):
    """
    Clean and preprocess email text content.
    - Strips HTML tags
    - Converts to lowercase
    - Normalizes whitespace
    - Removes special characters
    """
    if not text:
        return ""
    
    # 1. Decode HTML entities (e.g., &amp; -> &)
    content = html.unescape(text)
    
    # 2. Strip HTML tags using regex
    content = re.sub(r"<[^>]*>", " ", content)
    
    # 3. Handle line breaks and whitespace
    content = re.sub(r'[\r\n\t]', ' ', content)
    content = re.sub(r'\s+', ' ', content).strip()
    
    # 4. Standardize case for classification
    content = content.lower()
    
    return content

def remove_stopwords(text):
    """
    Optional removal of common English stopwords.
    """
    stopwords = {"a", "an", "the", "in", "on", "at", "to", "for", "from", "with", "by", "of", "and", "or"}
    tokens = text.split()
    filtered = [t for t in tokens if t not in stopwords]
    return " ".join(filtered)
