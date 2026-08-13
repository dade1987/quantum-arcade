{{--
  A lesson page.

  The title and the description are NOT written by the lesson: they come
  from the level list, which is the same list the game reads to draw the
  map and to number the levels. Writing them here by hand is what let the
  tab and the page disagree for twenty-one lessons.

  The lesson itself supplies only its body — the renderLesson({…}) call —
  through the `lesson` section.
--}}
@extends('layouts.page', [
    'title' => $level['n'] . '. ' . $level['title'][$locale] . ' — Quantum Arcade',
    'description' => $description ?? $level['description'][$locale],
    'ogType' => 'article',
])

@section('body')
<div id="app"></div>
@endsection

@push('scripts')
<script type="module">
@yield('lesson')
</script>
@endpush
