import torch
from tokenizer import Tokenizer
from transformer import GPTModel
from model.config import GPT_CONFIG_124M

@torch.no_grad()
def generate_text_simple(model, idx, max_new_tokens, context_size):
    """
    モデルを使用して、入力されたトークン(idx)に続くテキストを生成する
    """
    for _ in range(max_new_tokens):
        idx_cond = idx[:, -context_size:]

        logits = model(idx_cond)
        logits = logits[:, -1, :]

        if top_k is not None:
            top_logits, _ = torch.topk(logits, top_k)
            min_val = top_logits[:, -1]
            logits = torch.where(
                logits < min_val,
                torch.tensor(float("-inf")).to(logits.device),
                logits
            )
        
        if temperature > 0.0:
            logits = logits / temperature
            logits = logits - logits.max(dim=-1, keepdim=True).values
            probs = torch.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
        else:
            idx_next = torch.argmax(logits, dim=-1, keepdim=True)
        
        if eos_id is not None and idx_next.item() == eos_id:
            break

        idx = torch.cat((idx, idx_next), dim=1)
    return idx

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 1. トークナイザとモデルの準備
    tokenizer = Tokenizer()
    model = GPTModel(GPT_CONFIG_124M).to(device)
    
    # 2. 本来はここで学習済みの重みをロードします
    # 例: model.load_state_dict(torch.load("model_weights.pth", map_location=device))
    model.eval()

    print("\n--- 自作GPTモデル (GPT-2 124M 相当) 起動中 ---")
    print("'exit' と入力すると終了します。")

    while True:
        user_input = input("\nUser > ")
        if user_input.lower() == "exit":
            break

        if not user_input.strip():
            continue

        # トークン化
        input_ids = tokenizer.encode(user_input).to(device)
        
        # 生成
        output_ids = generate_text_simple(
            model, 
            input_ids, 
            max_new_tokens=25, 
            context_size=GPT_CONFIG_124M["context_length"]
        )
        
        # デコードして表示
        response = tokenizer.decode(output_ids)
        print(f"GPT  > {response}")

if __name__ == "__main__":
    main()