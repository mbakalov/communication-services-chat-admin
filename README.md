# communication-services-chat-admin

## Live App

Live app is hosted [here](https://happy-plant-0ba510e10.1.azurestaticapps.net/).

## Description

This is a simple helper SPA to manage [Azure Communication Services](https://azure.microsoft.com/services/communication-services/)
chat [threads](https://docs.microsoft.com/azure/communication-services/concepts/chat/concepts#chat-overview).

With this app you can:

- Create a new user with an access token OR use an existing user and
generate an access token for them.

- List chat threads for the given user.

- Create new chat threads for the given user.

- TBD: edit threads by adding/removing participants.

- TBD: delete threads.

- TBD: send messages to threads.

## Usage

1. Enter your [connection string](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).

1. Press 'Generate User and/or Token' to create a new user and token, OR

1. Paste in existing user id and press 'Generate User and/or Token' to obtain
a new token for that user.

1. Press 'Load Chat Threads' to display (up to 20) chat threads that the user
belongs to.

1. Press 'New chat thread' to create a new thread for this user.
