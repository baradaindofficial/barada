"""
setup_jest.py
Barada Digital Platform — Sprint 4.4 pre-work regression fix

Jest was never actually installed/configured — only @types/jest (type defs)
made it in during Sprint 4.3. Test files exist but have no runner.

This script:
  1. Creates jest.config.js using Next.js's built-in `next/jest` transformer
     (auto-handles SWC transform + reads @/* path alias from tsconfig.json)
  2. Adds "test" and "test:watch" scripts to package.json

After running this script, you still need to run:
  npm install --save-dev jest

Run from repo root: py setup_jest.py
"""
import json
import os

JEST_CONFIG = '''const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts', '<rootDir>/__tests__/**/*.test.tsx'],
}

module.exports = createJestConfig(customJestConfig)
'''

def write_jest_config():
    path = "jest.config.js"
    if os.path.exists(path):
        print(f"  SKIP (already exists): {path}")
        return
    with open(path, "w", encoding="utf-8") as f:
        f.write(JEST_CONFIG)
    print(f"  Created: {path}")

def update_package_json():
    path = "package.json"
    with open(path, "r", encoding="utf-8") as f:
        pkg = json.load(f)

    changed = False
    if pkg["scripts"].get("test") != "jest":
        pkg["scripts"]["test"] = "jest"
        changed = True
    if "test:watch" not in pkg["scripts"]:
        pkg["scripts"]["test:watch"] = "jest --watch"
        changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(pkg, f, indent=2)
            f.write("\n")
        print("  Updated: package.json (added test, test:watch scripts)")
    else:
        print("  No change needed: package.json")

def main():
    print("Setting up Jest test runner...")
    write_jest_config()
    update_package_json()
    print("\nDone.")
    print("Next: run `npm install --save-dev jest` then `npm test`.")

if __name__ == "__main__":
    main()
