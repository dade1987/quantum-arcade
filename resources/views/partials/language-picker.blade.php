{{--
  The language picker, in one place.

  It used to be hand-written into every static page, which meant nine copies
  of the same markup with nine chances to get an address wrong — and one of
  them did: the Spanish pages linked back to the Italian home.

  Here the addresses come from `$alternates`, the same list the <head> uses
  for its hreflang tags, so the picker and the search engines can never be
  told two different things.

  On the design: each language is written in its own language («Español»,
  not «Spagnolo»), because that is how someone looks for their own; and a
  globe rather than a flag, because flags stand for countries and Spanish
  has twenty of them. It is a <details>, so it works with the keyboard and
  announces itself to a screen reader without a hand-rolled menu.
--}}
<details class="lang-pick">
  <summary class="lang-now" title="{{ __('Cambia lingua') }}">
    <span class="lang-globe" aria-hidden="true">🌐</span>
    <span class="lang-name">{{ $localeNames[$locale] }}</span>
    <span class="sr-only"> — {{ __('cambia lingua') }}</span>
  </summary>
  <div class="lang-menu" role="menu">
    @foreach($localeNames as $code => $name)
      @if($code === $locale)
        <span class="lang-item on" role="menuitem" lang="{{ $code }}" aria-current="true"><span class="lang-tick" aria-hidden="true">✓</span>{{ $name }}</span>
      @else
        <a class="lang-item" role="menuitem" href="{{ $alternates[$code] }}" hreflang="{{ $code }}" lang="{{ $code }}"><span class="lang-tick" aria-hidden="true"></span>{{ $name }}</a>
      @endif
    @endforeach
  </div>
</details>
