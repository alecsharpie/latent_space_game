
upload_assets:
	gsutil cp src/assets/latent_space_background_8bit.png gs://latentspacemuseum/assets/latent_space_background_8bit.png
	gsutil cp src/assets/goal.png gs://latentspacemuseum/assets/goal.png
	gsutil cp src/assets/fire_wizard_spritesheet_transparent.png gs://latentspacemuseum/assets/fire_wizard_spritesheet_transparent.png
	gsutil cp src/assets/leafy_druid_spritesheet_transparent.png gs://latentspacemuseum/assets/leafy_druid_spritesheet_transparent.png

# upload_images:
# 	gsutil -m cp -r src/assets/artist_images_semisimple gs://latentspacemuseum/


set_bucket_cors:
	gsutil cors set bucket_cors.json gs://latentspacemuseum

build:
	webpack --config webpack/prod.js
	docker build --tag asia.gcr.io/alecsharpie/latentspacemuseum .

# docker_run:
# 	set -o allexport; source .env; set +o allexport;
# 	docker run -e PORT=8000 -e APP_PASSWORD=${APP_PASSWORD} -p 8000:8000 asia.gcr.io/alecsharpie/latentspacemuseum
run:
	docker run -e PORT=8000 -p 8080:8000 asia.gcr.io/alecsharpie/latentspacemuseum

# Hop inside my shell
run_interactive:
	docker run -e PORT=8000 -p 8080:8000 -it asia.gcr.io/alecsharpie/latentspacemuseum sh

# Pushes to container registry (gcp)
docker_push:
	docker push asia.gcr.io/alecsharpie/latentspacemuseum

gcloud_deploy:
	docker push asia.gcr.io/alecsharpie/latentspacemuseum
	gcloud run deploy latentspacemuseum --image asia.gcr.io/alecsharpie/latentspacemuseum \
	--region asia-east1 \
	--timeout=10m \
	--memory 2Gi
