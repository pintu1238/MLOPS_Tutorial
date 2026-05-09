class Employee:
    def __init__(self):
        print("starting executing attributes/data")
        self.id=123
        self.salary=50555
        self.designation="Software Engineer"
        print("attributes/data executed successfully")


    def travel(self, destination):
        print("this travel function was called manually")
        print(f"Employee is now Travelling to {destination}")     

# creating an object of the class Employee
sam=Employee()
print(sam.id)
print(sam.salary)
print(sam.designation)

# calling a method 
sam.travel("Bangalore")        


