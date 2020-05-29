module inbound_web_socket_handler {
  source = "../shared/lambda"
  name = "inbound-web-socket-handler"
  source_file = "../../../.webpack/inbound-web-socket-handler.js"
}

# module lambda_goodbyeWorld {
#   source = "../shared/lambda"
#   name = "goodbyeWorld"
#   source_file = "../../../.webpack/goodbyeWorld.js"
# }