{{--
  The shell every page of the course sits in.

  Everything that used to be copied by hand into ninety-three static files
  lives here once: the character set, the stylesheet, the icon, and — the
  part that actually went wrong — the <title>, the canonical link and the
  hreflang tags.

  Twenty-one lessons out of twenty-eight had drifted: the browser tab said
  «17 · QFT» while the page itself said «18. QFT», and 01-qubit.html still
  announced a title from an ordering abandoned two reorganisations earlier.
  A validator check caught it after the fact. This layout makes it
  impossible: no page writes its own title.
--}}
<!doctype html>
<html lang="{{ $locale }}" data-root="/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}">
<meta name="author" content="Davide Cavallini">
<meta name="robots" content="{{ $robots ?? 'index, follow, max-image-preview:large, max-snippet:-1' }}">

<link rel="canonical" href="{{ $canonical }}">
@foreach($alternates as $code => $path)
<link rel="alternate" hreflang="{{ $code }}" href="{{ \App\Support\Site::url($path) }}">
@endforeach
{{-- Italian is the source language, so it is also what we offer to anyone
     whose language we do not publish. --}}
<link rel="alternate" hreflang="x-default" href="{{ \App\Support\Site::url($alternates['it']) }}">

<meta property="og:type" content="{{ $ogType ?? 'website' }}">
<meta property="og:locale" content="{{ \App\Support\Site::tag($locale) }}">
<meta property="og:site_name" content="Quantum Arcade">
<meta property="og:title" content="{{ $ogTitle ?? $title }}">
<meta property="og:description" content="{{ $ogDescription ?? $description }}">
<meta property="og:image" content="{{ \App\Support\Site::url('/assets/logo-wordmark.svg') }}">
<meta name="twitter:card" content="summary_large_image">

<link rel="stylesheet" href="/css/style.css">
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">

@stack('head')
</head>
<body>

@yield('body')

@stack('scripts')
</body>
</html>
