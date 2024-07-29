from flask import Blueprint, request, jsonify
from db import get_db_connection

bp = Blueprint('routes', __name__)

@bp.route('/api/query', methods=['POST'])
def query():
    question = request.json['question'].lower()
    conn = get_db_connection()
    cursor = conn.cursor()
    chart_data = {'labels': [], 'data': []}
    answer = ""

    if "average salary by department" in question:
        cursor.execute("SELECT department, AVG(salary) FROM employees GROUP BY department")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Average salary by department"
    elif "total salary expenditure by department" in question:
        cursor.execute("SELECT department, SUM(salary) FROM employees GROUP BY department")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Total salary expenditure by department"
    elif "number of employees by department" in question:
        cursor.execute("SELECT department, COUNT(*) FROM employees GROUP BY department")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Number of employees by department"
    elif "average age by department" in question:
        cursor.execute("SELECT department, AVG(age) FROM employees GROUP BY department")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Average age by department"
    elif "number of employees by position" in question:
        cursor.execute("SELECT position, COUNT(*) FROM employees GROUP BY position")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Number of employees by position"
    elif "average salary by position" in question:
        cursor.execute("SELECT position, AVG(salary) FROM employees GROUP BY position")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Average salary by position"
    elif "total salary expenditure by position" in question:
        cursor.execute("SELECT position, SUM(salary) FROM employees GROUP BY position")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Total salary expenditure by position"
    elif "average age by position" in question:
        cursor.execute("SELECT position, AVG(age) FROM employees GROUP BY position")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Average age by position"
    elif "salary distribution by age" in question:
        cursor.execute("SELECT age, AVG(salary) FROM employees GROUP BY age")
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Salary distribution by age"
    elif "employee count by age range" in question:
        cursor.execute("""
            SELECT CASE
                WHEN age BETWEEN 20 AND 29 THEN '20-29'
                WHEN age BETWEEN 30 AND 39 THEN '30-39'
                WHEN age BETWEEN 40 AND 49 THEN '40-49'
                WHEN age BETWEEN 50 AND 59 THEN '50-59'
                ELSE '60+'
            END AS age_range, COUNT(*) FROM employees GROUP BY age_range
        """)
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Employee count by age range"
    elif "total salary expenditure by age range" in question:
        cursor.execute("""
            SELECT CASE
                WHEN age BETWEEN 20 AND 29 THEN '20-29'
                WHEN age BETWEEN 30 AND 39 THEN '30-39'
                WHEN age BETWEEN 40 AND 49 THEN '40-49'
                WHEN age BETWEEN 50 AND 59 THEN '50-59'
                ELSE '60+'
            END AS age_range, SUM(salary) FROM employees GROUP BY age_range
        """)
        data = cursor.fetchall()
        for row in data:
            chart_data['labels'].append(row[0])
            chart_data['data'].append(row[1])
        answer = "Total salary expenditure by age range"
    else:
        answer = "Sorry, I didn't understand the question."

    conn.close()
    return jsonify({'answer': answer, 'chart_data': chart_data})
