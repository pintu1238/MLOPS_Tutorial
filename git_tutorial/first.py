a ="Welcome to MLOPS Course"
print(a)


commands = [
    "1. git init (to initialize a git repo)",
    "2. git status (tells you current status of git repo)",
    "3. git add filename.py | git add . (move work to staging area)",
    '4. git commit -m "commit message"',
    "5. Create a .gitignore file and add files/folders that doesn't need tracking."
]

print("BASIC COMMANDS\n")

for cmd in commands:
    print(cmd)



commands_b = [
    "1. git log (see details for all the commits)",
    "2. git log --oneline (1 liner details for all commits)",
    "3. git log --stat (details of changes on commit level)",
    "4. git log -p (see code changes on commit level)",
    "5. git show <6 digit sha id> (see changes on specific commit)",
    "6. git diff (changes made within staging area before commit)"
]

print("SEEING COMMITS\n")

for cmd in commands_b:
    print(cmd)




branching_commands = [
    "1. git branch <name> <sha id> (creates a new branch)",
    "2. git branch (lists all branches)",
    "3. git checkout <branch> (switch to another branch)",
    "4. git log --oneline --all (see commits of all branches)",
    "5. git log --oneline --all --graph (graph of commits from all branches)",
    "6. git branch -d/-D <branch> (deletes a branch)",
    "7. git merge <branch> (run from master/main)"
]

print("BRANCHING AND MERGING\n")

for command in branching_commands:
    print(command)

