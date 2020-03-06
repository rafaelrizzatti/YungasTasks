from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'crud.sqlite')
db = SQLAlchemy(app)
ma = Marshmallow(app)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    description = db.Column(db.String(120))
    deadline = db.Column(db.DateTime, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)

    def __init__(self, title, description, deadline):
        self.title = title
        self.description = description
        self.deadline = deadline
        #self.completed_at = completed_at


class TaskSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('id', 'title', 'description', 'deadline', 'completed_at')


task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)


@app.route("/task", methods=["POST"])
def add_task():
    title = request.json['title']
    description = request.json['description']
    deadline = request.json['deadline']
    #completed_at = request.json['completed_at']

    new_task = Task(title, description, datetime.strptime(deadline, '%m/%d/%Y %H:%M:%S'),
                    #datetime.strptime(completed_at, '%m/%d/%y %H:%M:%S')
                    )
    db.session.add(new_task)
    db.session.commit()

    return task_schema.jsonify(new_task)


@app.route("/task", methods=["GET"])
def get_task():
    all_tasks = Task.query.all()
    result = tasks_schema.dump(all_tasks)
    return jsonify(result)


@app.route("/task/<id>", methods=["GET"])
def task_detail(id):
    task = Task.query.get(id)
    return task_schema.jsonify(task)


@app.route("/task/<id>", methods=["PUT"])
def task_update(id):
    task = Task.query.get(id)
    title = request.json['title']
    description = request.json['description']
    deadline = request.json['deadline']

    if 'completed_at' in request.json:
        completed_at = request.json['completed_at']
        task.completed_at = datetime.strptime(completed_at, '%m/%d/%Y %H:%M:%S')

    task.title = title
    task.description = description
    task.deadline = datetime.strptime(deadline, '%m/%d/%Y %H:%M:%S')

    db.session.commit()
    return task_schema.jsonify(task)


@app.route("/task/<id>", methods=["DELETE"])
def task_delete(id):
    task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()

    return task_schema.jsonify(task)


@app.route("/complete_task/<id>", methods=["POST"])
def complete_task(id):
    task = Task.query.get(id)
    task.completed_at = datetime.now()

    db.session.commit()
    return task_schema.jsonify(task)


@app.route("/incomplete_task/<id>", methods=["POST"])
def incomplete_task(id):
    task = Task.query.get(id)
    task.completed_at = None

    db.session.commit()
    return task_schema.jsonify(task)


if __name__ == '__main__':
    app.run(debug=True)