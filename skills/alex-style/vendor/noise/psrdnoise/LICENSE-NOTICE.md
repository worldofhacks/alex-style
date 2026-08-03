# psrdnoise — license notice (authored by alex-style sync; no upstream LICENSE file exists)

stegu/psrdnoise ships NO top-level LICENSE file (GitHub license detector: None).
The MIT grant lives in two upstream places, both verified at pinned commit
419175a270862ce7ae692038fafafb42ec0427e9:

1. README.md, section "LICENSE": "All GLSL code in this repository is published
   under the permissive MIT license" — followed by the full grant text,
   "Copyright 2021 Stefan Gustavson and Ian McEwan".
2. Every vendored file's header carries the complete MIT text (or a short MIT
   pointer in the -min/mpsrdnoise variants).

The in-file headers are therefore the operative license text. NEVER strip them
from vendored or project copies — sync and the arsenal self-test hard-fail if
a file loses its MIT header.
