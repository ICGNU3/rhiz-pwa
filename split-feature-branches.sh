#!/bin/bash
set -e

echo "Starting aggressive feature branch split..."

git checkout main
git pull

# Analytics & Intelligence
BRANCH=feature/analytics-intelligence
echo "\nCreating $BRANCH..."
git checkout -b $BRANCH main
git cherry-pick e9031d8 5681e68 c33d422 e559038 65e1e7a 5ad67e5
git push -u origin $BRANCH

# Contact Management
BRANCH=feature/contact-management
echo "\nCreating $BRANCH..."
git checkout main
git checkout -b $BRANCH
git cherry-pick 81ea973 5681e68 dac1045 65e1e7a
git push -u origin $BRANCH

# Auth & Profiles
BRANCH=feature/auth-profiles
echo "\nCreating $BRANCH..."
git checkout main
git checkout -b $BRANCH
git cherry-pick 71316cd 5681e68 71bf8ed 92d7054
git push -u origin $BRANCH

# PWA & Infrastructure
BRANCH=feature/pwa-infra
echo "\nCreating $BRANCH..."
git checkout main
git checkout -b $BRANCH
git cherry-pick 5681e68 a501763 8198dfc c378e8d 07c9f86 71bf8ed 53dc8aa 6ac17a9 436f554 af4c5de
git push -u origin $BRANCH

# Templates & Onboarding
BRANCH=feature/templates-onboarding
echo "\nCreating $BRANCH..."
git checkout main
git checkout -b $BRANCH
git cherry-pick 81ea973 71316cd 5681e68
git push -u origin $BRANCH

# AI/Contextual Features
BRANCH=feature/ai-context
echo "\nCreating $BRANCH..."
git checkout main
git checkout -b $BRANCH
git cherry-pick c33d422 e559038 65e1e7a 5681e68
git push -u origin $BRANCH

echo "\nAll feature branches created and pushed!" 