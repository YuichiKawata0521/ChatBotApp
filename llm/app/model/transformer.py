import torch
import torch.nn as nn
from modules import LayerNorm, FeedForward
from attention import MultiHeadAttention

class TransformerBlock(nn.Module):
    """
    GPT-2の1層分（デコーダーブロック）を定義します。
    1. Pre-LayerNorm (Attentionの前で正規化)
    2. Multi-Head Attention
    3. Dropout & 残差接続 (Residual Connection)
    4. Pre-LayerNorm (FeedForwardの前で正規化)
    5. FeedForward
    6. Dropout & 残差接続 (Residual Connection)
    """
    def __init__(self, cfg):
        super().__init__()
        self.att = MultiHeadAttention(
            d_in=cfg["emb_dim"],
            d_out=cfg["emb_dim"],
            context_length=cfg["context_length"],
            dropout=cfg["drop_rate"],
            num_heads=cfg["n_heads"],
            qkv_bias=cfg["qkv_bias"]
        )
        self.ff = FeedForward(cfg)
        self.norm1 = LayerNorm(cfg["emb_dim"])
        self.norm2 = LayerNorm(cfg["emb_dim"])
        self.drop_shortcut = nn.Dropout(cfg["drop_rate"])
    
    def forward(self, x):

        shortcut = x
        x = self.norm1(x)
        x = self.att(x)
        x = self.drop_shortcut(x)
        x = x + shortcut

        shortcut = x
        x = self.norm2(x)
        x = self.ff(x)
        x = self.drop_shortcut(x)
        x = x + shortcut

        return x
        