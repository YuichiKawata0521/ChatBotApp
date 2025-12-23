import os
from pathlib import Path
import pandas as pd
from datasets import load_dataset

DATA_PATH_RELATIVE = "data"
FILE_NAME = "databricks-dolly-15k-ja.json"
HUGGINHFACE_DATASET_NAME = "kunishou/databricks-dolly-15k-ja"

DATA_DIR = Path.cwd() / DATA_PATH_RELATIVE
FULL_PATH = DATA_DIR / FILE_NAME

print(f"目標のファイルパス: ", FULL_PATH)

if FULL_PATH.exists():
    print("インストラクションチューニング用の日本語データセットがローカルに保存されています")
else:
    print("インストラクションチューニング用の日本語データセットが見つかりませんでした。DLを開始します")
    try:
        if not DATA_DIR.exists():
            os.makedirs(DATA_DIR, exist_ok=True)
        
        
        ds = load_dataset(HUGGINHFACE_DATASET_NAME)
        df_download = ds["train"].to_pandas()
        df_download.to_json(
            FULL_PATH,
            orient="records",
            force_ascii=False,
            indent=4
        )
        df = pd.read_json(FULL_PATH, orient="records")
        print("DLに成功しました。総レコード数: ", len(df), "行")

    except Exception as e:
        print("インストラクションチューニング用の日本語データセットDL中にエラーが発生しました")

        
