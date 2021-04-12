original_path=$(pwd)


for folder in search_classes
do
  # shellcheck disable=SC2164
  cd "$original_path"/flask_app/templates/"$folder"/react_scripts/src/
  npx babel --watch *.jsx --out-dir . --presets @babel/preset-react --development true &
  for sub_folder in */ ; do
    npx babel --watch "$sub_folder"/*.jsx --out-dir "$sub_folder" --presets @babel/preset-react --development true &
  done

  # shellcheck disable=SC2103
  cd ..
  npx webpack --config webpack.config.js --watch --mode development &
done

# shellcheck disable=SC2164
cd "$original_path"