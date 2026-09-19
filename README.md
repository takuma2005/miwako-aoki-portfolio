# 青木みわこ ポートフォリオサイト 編集ガイド

このサイトの内容を更新するための、非エンジニア向けの簡単な手引きです。
基本的には `index.html` をテキストエディタ（メモ帳や VS Code など）で開いて編集します。

---

## 1. ボイスサンプルを差し替える

1. 新しい音声ファイル（mp3）を `assets/audio/` フォルダに入れます。
2. `index.html` 内の該当する `sample-card` ブロックを探します（`<article class="sample-card ...">` で始まる部分）。
3. 以下の項目を書き換えます。

   - `data-src="assets/audio/sample1.mp3"` → 差し替えた音声ファイルのパス
   - `data-title="番組ナレーション"` → 音声のタイトル（再生プレイヤーに表示される名前）
   - `<h3 class="sample-title">番組ナレーション</h3>` → カードに表示されるタイトル（`data-title` と揃えてください）
   - `<p class="sample-meta">TV番組ナレーション&ensp;2024年2月</p>` → ジャンルや収録時期などの説明文
   - `<span class="sample-duration">1:14</span>` → 音声の長さ（分:秒）

例：
```html
<article class="sample-card reveal" data-src="assets/audio/sample1.mp3" data-title="番組ナレーション">
    ...
    <h3 class="sample-title">番組ナレーション</h3>
    <p class="sample-meta">TV番組ナレーション&ensp;2024年2月</p>
    ...
    <span class="sample-duration">1:14</span>
</article>
```

---

## 2. 実績（work-card）を追加する

1. `index.html` 内の実績一覧セクションから、既存の `work-card` ブロック（`<article class="work-card ...">` で始まる部分）を1つコピーします。
2. コピーしたブロックを同じ場所に貼り付け、内容を新しい実績に書き換えます。
3. `data-category` の値を、実績の種類に応じて以下のいずれかに設定します。

   - `cm` … CM
   - `vp` … 企業VP（プロモーション映像など）
   - `tv` … TV番組
   - `other` … その他

4. カード内のタグ・タイトル・クライアント名などのテキストも合わせて書き換えます。

### `is-extra` クラスについて

`class="work-card reveal is-extra"` のように `is-extra` が付いているカードは、
最初は非表示になっており、サイト上の「もっと見る」ボタンを押したときに表示される実績です。

- すぐに一覧表示したい実績 → `is-extra` を**付けない**
- 「もっと見る」で追加表示したい実績 → `is-extra` を**付ける**

新しく実績を追加する際は、目立たせたいかどうかでこのクラスの有無を調整してください。

---

## 3. プロフィール写真を差し替える

1. 新しい写真を用意し、ファイル名を `profile.jpg` にします（同じファイル名で上書きするのが簡単です）。
2. `assets/images/profile.jpg` に置き換えます。
3. 写真のサイズは、既存の `profile.jpg` に近い縦横比にするとレイアウトが崩れにくいです。

※ ファイル名を変える場合は、`index.html` 内の `profile.jpg` を参照している箇所（`<img>` タグや OGP 画像設定）もあわせて書き換えてください。

---

## 4. お問い合わせフォームを有効にする（Formspree）

受信先メールアドレスは **Formspreeの管理画面だけ** に登録します。
HTML、JavaScript、構造化データ、READMEには記載しないでください。

1. [Formspree](https://formspree.io/create)で登録・メール認証を行い、新しいフォームを作ります。
2. フォームの通知先（Target Email）を設定し、必要な受信先認証を完了します。
3. Integrationに表示される `https://formspree.io/f/` で始まるフォームURLをコピーします。
4. `index.html` の `<form id="contactForm" ...>` に、発行されたURLを `action` 属性として追加します。
   例：`action="https://formspree.io/f/YOUR_FORM_ID"`（`YOUR_FORM_ID`は実際のIDに置き換えます）。
5. 公開サイトで送信し、日本語の受付完了画面、Formspreeの受信一覧、通知メールの受信を確認します。

フォームURLは設定済みです。URLが未設定・不正な場合は送信ボタンが無効になり、Instagramへの案内を表示します。
メールアプリは使わずFormspreeへPOSTします。必要に応じて迷惑送信対策の確認画面へ進み、受付成功後に完了画面が表示されます。
入力内容は送信前に消去しません。エラー時はブラウザで戻って内容を確認してください。

受信先の変更はFormspree側で行います。フォームIDを変更したときだけ、サイトの `action` を更新します。
JavaScriptが無効な場合は送信できず、Instagramへの案内を表示します。
過去に公開したメールアドレスはGit履歴や検索キャッシュに残る可能性があります。本変更では履歴を書き換えません。

仕様：[HTMLフォーム](https://help.formspree.io/articles/building-your-form/building-an-html-form)、[日本語表示](https://help.formspree.io/articles/building-your-form/localization-and-translation)。

---

## 5. サイトを公開する（GitHub Pages ＋ 独自ドメイン miwako-aoki.com）

### 初回セットアップ

1. GitHub にリポジトリを作成し、このフォルダの中身をすべてアップロード（push）します。
   `CNAME`（独自ドメイン設定）と `.nojekyll` も忘れずに含めてください。
2. リポジトリの **Settings → Pages** を開き、
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
   を選択して保存します。
3. 同じ Pages 設定画面の **Custom domain** に `miwako-aoki.com` と入力して保存し、
   **Enforce HTTPS** にチェックを入れます（DNS設定の反映後にチェック可能になります）。

### ドメイン側（DNS）の設定

ドメインを購入したサービス（お名前.com など）の DNS 設定で、以下のレコードを追加します。

| 種別 | ホスト名 | 値 |
|------|---------|-----|
| A | @（miwako-aoki.com） | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<GitHubユーザー名>.github.io` |

反映には数分〜数時間かかることがあります。

### 更新方法

ファイルを編集して push すれば、数分で自動的にサイトへ反映されます。

---

## 困ったときは

- 編集後は必ずブラウザでファイルを開いて、レイアウトが崩れていないか確認してください。
- HTML タグ（`<...>` の部分）は消さずに、タグの中の文字だけを書き換えるようにすると安全です。
- 不安な場合は、編集前のファイルをコピーして残しておくと安心です。
