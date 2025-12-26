GPT_CONFIG_124M = {
    "vocab_size": 50257,
    "context_length": 1024,
    "emb_dim": 768,
    "n_heads": 12,
    "n_layers": 12,
    "drop_rate": 0.1,
    "qkv_bias": False
}

GPT_CONFIG_355M = {
    "vocab_size": 50257,
    "context_length": 1024,
    "emb_dim": 1024,   # 768から1024へ
    "n_heads": 16,     # 12から16へ
    "n_layers": 24,    # 12から24へ
    "drop_rate": 0.0,
    "qkv_bias": True
}