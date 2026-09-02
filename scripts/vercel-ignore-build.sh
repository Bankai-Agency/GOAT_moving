#!/bin/bash
# Vercel Ignored Build Step (vercel.json -> ignoreCommand).
#
# Admin "save without publishing" commits carry the [skip deploy] marker:
# they must land in git (full history) but should not each burn a build.
# The "Опубликовать накопленное" button makes a normal commit that picks up
# everything accumulated since.
#
# Vercel semantics: exit 0 = skip the build, exit 1 = proceed.
case "$VERCEL_GIT_COMMIT_MESSAGE" in
  *"[skip deploy]"*)
    echo "skip: draft commit ([skip deploy] marker)"
    exit 0
    ;;
  *)
    exit 1
    ;;
esac
