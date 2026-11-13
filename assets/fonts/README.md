# Local fonts

- Browser: the lockfile-pinned Fontsource Noto Sans JP and Noto Serif JP
  packages bundle OFL-licensed WOFF2 files. Their CSS uses unicode ranges so
  browsers load only the subsets needed on each page.
- Open Graph: the two static WOFF files are used server-side only, at weights
  700 and 900. They retain the Japanese glyphs for future column titles.
  The original OFL license is included alongside them.

The Open Graph font source is
[NotoSansJP[wght].ttf from Google Fonts](https://github.com/google/fonts/blob/0fb1bdc740dd9d495e639a160778db34c28807b7/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf)
(SHA-256 `c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f`).
To regenerate a file, instantiate weight `700` or `900` with
`fonttools varLib.instancer`, then encode it with
`pyftsubset --unicodes='*' --flavor=woff`. Neither tool nor a Google Fonts
request is needed during an application build.
