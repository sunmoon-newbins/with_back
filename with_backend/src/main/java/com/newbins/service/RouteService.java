package com.newbins.service;

import com.newbins.dto.Route;
import com.newbins.dto.RoutePlace;
import com.newbins.entity.RouteEntity;

import java.util.List;

public interface RouteService {
    void createRoute(Route toute);
    Route getRoute(String routeNum);
    List<Route> getRoutes(int state, String sortType);
    List<Route> getRoutes(String userNum);
    List<Route> searchRoutes(String title, String content);
    List<RoutePlace> getRoutePlace(String routeNum);
}
