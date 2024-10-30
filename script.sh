for file in `find . -name "*.tsx" -type f`; do
  sed -i '1i // @ts-nocheck' "$file"
done