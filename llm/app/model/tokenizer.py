import tiktoken
import torch

class Tokenizer:
    def __init__(self, model_name="gpt2"):
        self.encoder = tiktoken.get_encoding(model_name)
    
    def encode(self, text):
        return torch.tensor(self.encoder.encode(text, allowed_special={"<|endoftext|>"})).unsqueeze(0)
    
    def decode(self, ids):
        return self.encoder.decode(ids.squeeze(0).tolist())

# def text_to_token_ids(text, tokenizer):
#     encoded = tokenizer.encode(text, allowed_special={"<|endoftext|>"})
#     encoded_tensor = torch.tensor(encoded).unsqueeze(0)
#     return encoded_tensor

# def token_ids_to_text(token_ids, tokenizer):
#     flat = token_ids.squeeze(0)
#     return tokenizer.decode(flat.tolist())