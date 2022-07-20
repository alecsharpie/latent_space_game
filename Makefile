upload_images:
	gsutil -m cp -r src/assets/artist_images_semisimple gs://website-assets-alecsharpie/latent_space_game

upload_assets:
	gsutil cp src/assets/latent_space_background_8bit.png gs://website-assets-alecsharpie/latent_space_game/assets/latent_space_background_8bit.png
	gsutil cp src/assets/goal.png gs://website-assets-alecsharpie/latent_space_game/assets/goal.png
	gsutil cp src/assets/fire_wizard_spritesheet_transparent.png gs://website-assets-alecsharpie/latent_space_game/assets
	gsutil cp src/assets/leafy_druid_spritesheet_transparent.png gs://website-assets-alecsharpie/latent_space_game/assets
