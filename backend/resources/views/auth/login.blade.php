<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ログイン</title>
</head>
<body>
    <main>
        <h1>ログイン</h1>

        @if ($errors->any())
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @endif

        <form method="post" action="{{ route('login.store') }}">
            @csrf
            <div>
                <label for="email">メールアドレス</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required>
            </div>
            <div>
                <label for="password">パスワード</label>
                <input id="password" name="password" type="password" required>
            </div>
            <div>
                <label>
                    <input type="checkbox" name="remember" value="1"> ログイン状態を保持
                </label>
            </div>
            <button type="submit">ログイン</button>
        </form>

        <p><a href="{{ route('register') }}">新規登録へ</a></p>
    </main>
</body>
</html>
