
## UTILS

set_bucket_cors:
	gsutil cors set bucket_cors.json gs://latentspacemuseum

upload_assets:
	gsutil cp src/assets/latent_space_background_8bit.png gs://latentspacemuseum/assets/latent_space_background_8bit.png
	gsutil cp src/assets/goal.png gs://latentspacemuseum/assets/goal.png
	gsutil cp src/assets/fire_wizard_spritesheet_transparent.png gs://latentspacemuseum/assets/fire_wizard_spritesheet_transparent.png
	gsutil cp src/assets/leafy_druid_spritesheet_transparent.png gs://latentspacemuseum/assets/leafy_druid_spritesheet_transparent.png
	gsutil cp src/assets/jellyfish_astronaut_spritesheet_transparent.png gs://latentspacemuseum/assets/jellyfish_astronaut_spritesheet_transparent.png
	gsutil cp src/assets/mark_zuckerberg_spritesheet_transparent.png gs://latentspacemuseum/assets/mark_zuckerberg_spritesheet_transparent.png
	gsutil cp src/assets/crungus_spritesheet_transparent.png gs://latentspacemuseum/assets/crungus_spritesheet_transparent.png
	gsutil cp src/assets/lsm_og_screenshot.png gs://latentspacemuseum/assets/lsm_og_screenshot.png
	gsutil cp src/assets/favicon_layers.png gs://latentspacemuseum/assets/favicon_layers.png

# upload_images:
# 	gsutil -m cp -r src/assets/artist_images gs://latentspacemuseum/

## BUILD

build:
	webpack --config webpack/prod.js
	docker build --tag asia.gcr.io/alecsharpie/latentspacemuseum .

run:
	docker run -e PORT=8000 -p 8080:8000 asia.gcr.io/alecsharpie/latentspacemuseum

run_interactive:
	docker run -e PORT=8000 -p 8080:8000 -it asia.gcr.io/alecsharpie/latentspacemuseum sh

## DEPLOY

docker_push:
	docker push asia.gcr.io/alecsharpie/latentspacemuseum

gcloud_deploy:
	docker push asia.gcr.io/alecsharpie/latentspacemuseum
	gcloud run deploy latentspacemuseum --image asia.gcr.io/alecsharpie/latentspacemuseum \
	--region asia-east1 \
	--timeout=10m \
	--memory 2Gi

build_deploy:
	webpack --config webpack/prod.js
	docker build --tag asia.gcr.io/alecsharpie/latentspacemuseum .
	docker push asia.gcr.io/alecsharpie/latentspacemuseum
	gcloud run deploy latentspacemuseum --image asia.gcr.io/alecsharpie/latentspacemuseum \
	--region asia-east1 \
	--timeout=10m \
	--memory 2Gi
