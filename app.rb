require 'rubygems'
require 'bundler/setup'

require 'json'
require 'savon'
require 'sinatra/base'

# Silence the output of third-party libraries
HTTPI.log = false
Savon.configure do |config|
	config.log = false
end

class NASA
	# This class implements the public method 
	# ground_stations_json as required by the specification. 

	def initialize
		@soap_client = Savon::Client.new('http://sscweb.gsfc.nasa.gov/WS/ssc/2/SatelliteSituationCenterService?wsdl')
	end
	
	def ground_stations
		response = @soap_client.request(:wsdl, :get_all_ground_stations)
		stations = response.body[:get_all_ground_stations_response][:return]
	end
	
	def ground_stations_json
		ground_stations.to_json
	end

end

class GroundStationApp < Sinatra::Base
	# This class implements a Sinatra web application. 
	
	configure do
		enable :logging
		enable :static # Serve static files from the /public directory
	end

	get '/' do
		# No server-side processing or template rendering is necessary
		# in the index. Simply redirect to the static page. 
		redirect to('/index.html')
	end
	
	get '/stations' do
		# The interface's JavaScript code calls this endpoint to download 
		# the ground station coordinates in JSON format. 
		content_type :json
		NASA.new.ground_stations_json
	end

end
