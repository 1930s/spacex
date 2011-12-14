require 'rubygems'
require 'bundler/setup'

require 'json'
require 'savon'
require 'sinatra/base'

HTTPI.log = false
Savon.configure do |config|
	config.log = false
end

class NASA

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
	
	configure do
		enable :logging
		enable :static
	end

	get '/' do
		redirect to('/index.html')
	end
	
	get '/stations' do
		content_type :json
		NASA.new.ground_stations_json
	end

end
