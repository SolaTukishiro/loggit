<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ダッシュボード</title>
</head>
<body>
    <main>
        <h1>ダッシュボード</h1>
        <p>ログイン中: {{ auth()->user()->name ?? auth()->user()->email }}</p>

        <form method="post" action="{{ route('logout') }}">
            @csrf
            <button type="submit">ログアウト</button>
        </form>
    </main>
</body>
</html>
