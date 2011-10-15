@cd ..
@echo Generating NaturalDocs
@if not exist "./docs/out" mkdir "./docs/out"
@perl "/NaturalDocs/NaturalDocs" -i "./modules" -i "./core" -o HTML "./docs/out" -p "./docs"
@echo Documentation available at "./docs/out/index.html"
@pause