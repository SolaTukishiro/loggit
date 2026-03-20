<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>新規登録</title>
</head>
<body>
    <main>
        <h1>新規登録</h1>

        @if ($errors->any())
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @endif

        <form method="post" action="{{ route('register.store') }}">
            @csrf
            <div>
                <label for="name">名前</label>
                <input id="name" name="name" type="text" value="{{ old('name') }}" required>
            </div>
            <div>
                <label for="email">メールアドレス</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required>
            </div>
            <div>
                <label for="password">パスワード</label>
                <input id="password" name="password" type="password" required>
            </div>
            <div>
                <label for="password_confirmation">パスワード（確認）</label>
                <input id="password_confirmation" name="password_confirmation" type="password" required>
            </div>
            <button type="submit">登録</button>
        </form>

        <p><a href="{{ route('login') }}">ログインへ</a></p>
    </main>
</body>
</html>
