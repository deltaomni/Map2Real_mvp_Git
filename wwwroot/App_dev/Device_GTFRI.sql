SELECT *, FROM_UNIXTIME(event_date- 3*3600) AS date_bsb FROM map2real.events 
where event_type <> 'GTIGF2'
and event_type <> 'GTMPF'
#and device_imei in( '122145','862193026868968','867488060855003','867488060855136')
#and device_imei in( '122145','862193026868968','867488060855003','867488060855136')
and device_imei in(   
	#'867488060855003',
    #'862193026868968',
    #'867488060855136',
	 '867488060827689'
	# '867488060821138',
	# '867488060828356',
	# '867488060847315',
	# '867488060842019'
    ) 
#and device_imei='122145' #BH
#and device_imei='862193026868968' # Astra JLL
#and device_imei='867488060855003' # Polo Campinas - 
#and event_type = 'DPA'
#and type_id = '10'
#and device_imei='867488060855136' #Bancada Campinas - Bancada
#and event_date >= '1719321391'
#and event_date <= '1719323468'
AND FROM_UNIXTIME(event_date - 3*3600) >= '2024-10-10'
#AND FROM_UNIXTIME(event_date) < '2024-06-27'
#order by device_imei, event_date asc;
order by  event_date desc;