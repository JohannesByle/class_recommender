# class_recommender
CSCI 335 class recommender project. Live demo [here](http://wheatonclassrecommender.pythonanywhere.com/search_classes)
## Suggested way to run the flask_app
1. Make sure you have set up your venv enviorment. If you don't have a folder called `venv` you can use [this](https://www.jetbrains.com/help/pycharm/creating-virtual-environment.html#python_create_virtual_env) guide to set it up.
2. Create a config.bat file similar to the one below, but replace the enviornment variables with your own:
```
call venv\Scripts\activate
set DATABASE_URL=sqlite:///db.sqlite
set FLASK_APP=flask_app.py
set FLASK_ENV=development
set EMAIL_PASSWORD=None
set EMAIL=None
```
3. From the command line from within the class_recommender directory run `config.bat`. Once this command has completed you should be in the virtual enviornment, from here run `flask run`:
```
>config.bat
>flask run
```
## Enviornment variables for flask_app
1. DATABASE_URL
2. EMAIL_PASSWORD
3. EMAIL
## Enviornment variables for scrapers
1. PORTAL_PASSWORD
2. PORTAL_USER_ID
3. STUDENT_ID
