#!/bin/bash
# Vercel Ignored Build Step (vercel.json -> ignoreCommand).
#
# Admin "save without publishing" commits carry the [skip deploy] marker in
# the commit SUBJECT: they must land in git (full history) but should not
# each burn a build. The "Опубликовать накопленное" button makes a normal
# commit that picks up everything accumulated since.
#
# Only the first line is checked, so a commit whose body merely mentions
# the marker (a changelog, a doc commit) still deploys.
#
# Vercel semantics: exit 0 = skip the build, exit 1 = proceed.
subject="${VERCEL_GIT_COMMIT_MESSAGE%%$'\n'*}"
case "$subject" in
  *"[skip deploy]"*)
    echo "skip: draft commit (marker in subject)"
    exit 0
    ;;
  *)
    exit 1
    ;;
esac
