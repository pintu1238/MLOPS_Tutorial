import mlflow
import mlflow.sklearn

from sklearn.datasets import load_wine
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

# Set experiment
mlflow.set_experiment("Wine_Classification")

# Load dataset
data = load_wine()  

X = data.data
y = data.target

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# Parameters
max_depth = 10
n_estimators = 15

with mlflow.start_run():

    rf = RandomForestClassifier(
        max_depth=max_depth,
        n_estimators=n_estimators,
        random_state=42
    )

    rf.fit(X_train, y_train)

    y_pred = rf.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    # log params
    mlflow.log_param("max_depth", max_depth)
    mlflow.log_param("n_estimators", n_estimators)

    # log metric
    mlflow.log_metric("accuracy", accuracy)

    # log model
    mlflow.sklearn.log_model(rf, name="random_forest_model")

    # creating a confusion matrix

    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=data.target_names, yticklabels=data.target_names)
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.savefig("confusion_matrix.png")

    # log artifacts using mlflow
    mlflow.log_artifact("confusion_matrix.png")
    mlflow.log_artifact(__file__)
    
    
    # tags 
    mlflow.set_tag("author", "Vicky")
    mlflow.set_tag("Project", "RandomForestClassifier")


    # Log the model
    mlflow.sklearn.log_model(rf, "Random Forest Classifier")

    print("Confusion Matrix:")

    print("Accuracy:", accuracy)

