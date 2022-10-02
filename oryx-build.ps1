# Script to build the repo the same way Azure Static Web Apps builds it, using https://github.com/microsoft/Oryx
# Used to debug build issues, such as: https://github.com/mbakalov/communication-services-chat-admin/actions/runs/3164995698/jobs/5153692666

docker run --volume ${pwd}:/repo `
  'mcr.microsoft.com/oryx/build:latest' `
  oryx build /repo --output /repo