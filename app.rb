require 'rubygems'
require 'bundler/setup'

require 'json'
require 'savon'
require 'sinatra/base'
require 'typhoeus'

HTTPI.log = false
Savon.configure do |config|
	config.log = false
end

class NASA

	def initialize(max_concurrency=10)
		@soap_client = Savon::Client.new('http://sscweb.gsfc.nasa.gov/WS/ssc/2/SatelliteSituationCenterService?wsdl')
		@reverse_geocode_client = Typhoeus::Hydra.new(:max_concurrency => max_concurrency)
	end
	
	def ground_stations
		response = @soap_client.request(:wsdl, :get_all_ground_stations)
		stations = response.body[:get_all_ground_stations_response][:return]
	end
	
	def ground_stations_with_countries
		stations = ground_stations
		stations_with_countries = []
		stations.each do |station|
			request = Typhoeus::Request.new("http://maps.googleapis.com/maps/api/geocode/json", 
																			:method => :get, 
																			:timeout => 1000, 
																			:params => {
																				:latlng => "#{station[:latitude]},#{station[:longitude]}", 
																				:sensor => false
																			})
			request.on_complete do |response|
				begin
					results = JSON.parse(response.body)
				else
					country = nil
					if results['status'] == 'OK'
						results['results'].each do |result|
							result['address_components'].each do |component|
								if component['types'].include? 'country' and not country
									country = component['short_name']
								end
							end
						end
					end
					if country
						station_with_country = station
						station_with_country[:country] = country
						stations_with_countries << station_with_country
					end
				end
			end
			@reverse_geocode_client.queue request
		end
		@reverse_geocode_client.run
		stations_with_countries
	end
	
	def ground_stations_json(with_countries=true)
		if with_countries
			ground_stations_with_countries.to_json
		else
			ground_stations.to_json
		end
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
