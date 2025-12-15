

# 🚀 Google Chat Build Notification Action 🛎️


A GitHub Action to send customizable build notifications to Google Chat rooms via webhook. Supports platform, changelog, version, build number, mentions, status, and images.

## ✨ Features
- 📢 Send build notifications to Google Chat via webhook
- 📝 Customizable message with platform, changelog, version, build number, status, and image
- 👥 Mention users or groups in the notification

## 🛠️ Inputs
| Name           | Description                                                                 | Required | Default         |
|----------------|-----------------------------------------------------------------------------|----------|-----------------|
| webhook-url    | The Google Chat incoming webhook URL. Obtain this from your Chat room.      | Yes      |                 |
| platform       | Build platform (e.g., iOS, Android). Used to customize the notification.    | Yes      |                 |
| changelog      | Changelog in markdown format. Included in the notification.                 | Yes      |                 |
| app-version    | Application version (e.g., 1.2.3).                                          | Yes      |                 |
| build-number   | Build number.                                                               | No       | N/A             |
| mention        | Mention user/group, e.g., <users/all> or <users/1234567890>.                | No       | <users/all>     |
| status         | Build status (success, failure, cancelled).                                 | No       | success         |
| image-url      | URL of the image to include in the notification.                            | No       | (platform icon) |

## 📋 Example Usage
```yaml
name: Notify Google Chat on Build
on:
  push:
    branches: [ main ]

jobs:
  notify:
	runs-on: ubuntu-latest
	
    steps:
	  - uses: actions/checkout@v4

      - name: Get Changelog
        id: get-changelog
        uses: release-flow/keep-a-changelog-action@v3
        with:
          command: query
          version: unreleased

	  - name: Google Chat Build Notification
		uses: AcmeSoftwareLLC/google-chat-build-notification@main
		with:
			webhook-url: ${{ secrets.GCHAT_WEBHOOK_URL }}
			platform: 'Android'
			changelog: ${{ steps.get-changelog.outputs.release-notes }}
			app-version: '1.2.3'
			build-number: '456'
            status: ${{ job.status }}
```

## 📝 License
MIT © Acme Software LLC
