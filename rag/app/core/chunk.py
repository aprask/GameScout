def chunk_text(text, cap=4096, overlap=250):
    result = []
    for element in text:
        while len(element) > cap:
            chunk = element[:cap]
            formatted_chunk = chunk.replace(",", " ")
            result.append(formatted_chunk)
            element = element[(cap - overlap) :]
        if element:
            formatted_element = element.replace(",", " ")
            result.append(formatted_element)
    return result
