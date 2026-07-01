with open("MASTER_BUILD_SPECIFICATION.md", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith("## 6.") and "Risk Register" not in line:
        pass
    new_lines.append(line)

with open("MASTER_BUILD_SPECIFICATION.md", "w") as f:
    f.writelines(new_lines)
