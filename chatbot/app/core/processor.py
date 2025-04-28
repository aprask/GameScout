def chunk_data(dataset_data, lim=10):
    chunked_data = []
    for data in dataset_data:
        content = str(data)
        content_len = len(content)
        if content_len <= lim:
            chunked_data.append(content)
        else:
            curr = 0
            prev_chunk = ""
            while curr < content_len:
                end = (
                    curr + lim
                )  # this tells us where we are (curr is a ptr to the text) and (end is our iteration threshold)
                if prev_chunk != "":
                    overlapped_str = prev_chunk + content[curr:end]
                    prev_chunk = content[curr:end]
                    chunked_data.append(overlapped_str)
                else:
                    chunked_data.append(content[curr:end])
                    prev_chunk = content[curr:end]
                curr = end
    return chunked_data
