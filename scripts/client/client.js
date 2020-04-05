var clientSystem = client.registerSystem(0, 0);

let globals = {
    me: null
};
clientSystem.initialize = function() {
    this.registerEventData("bedrockindustries:player_looking", { coords: null, player: null });
    this.listenForEvent("minecraft:hit_result_changed", (eventData) => this.onHit(eventData));
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onClientEnteredWorld(eventData));
    this.listenForEvent("bedrockindustries:looking_info", (eventData) => this.onLookingInfo(eventData));
};

clientSystem.onHit = function(eventData) {
    let coords = eventData.data.position;
    //clientSystem.sendMsg(coords.x + "|" + coords.y + "|" + coords.z);
    let broadcastData = clientSystem.createEventData("bedrockindustries:player_looking");
    broadcastData.data.coords = coords;
    broadcastData.data.player = globals.me;
    clientSystem.broadcastEvent("bedrockindustries:player_looking", broadcastData);
};

clientSystem.onLookingInfo = function(eventData) {
    let blockId = eventData.data.block;
    let player = eventData.data.player;

    if (player.id == globals.me.id) {
        // clientSystem.sendMsg(blockId);
        let sendData = clientSystem.createEventData("minecraft:send_ui_event");
        sendData.data.eventIdentifier = "updateInfo";
        sendData.data.data = blockId;
        clientSystem.broadcastEvent("minecraft:send_ui_event", sendData);
    }
}

clientSystem.sendMsg = function(msg) {
    let message = this.createEventData("minecraft:display_chat_event");
    message.data.message = msg;
    clientSystem.broadcastEvent("minecraft:display_chat_event", message);
};

clientSystem.onClientEnteredWorld = function(eventData) {
    clientSystem.sendMsg("§a @p §e hat die Welt betreten.");
    globals.me = eventData.data.player;
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "tooltip.html";
    loadEventData.data.options.is_showing_menu = false;
    loadEventData.data.options.absorbs_input = false;
    loadEventData.data.options.should_steal_mouse = true;
    loadEventData.data.options.render_game_behind = true;
    loadEventData.data.options.force_render_below = true;
    clientSystem.broadcastEvent("minecraft:load_ui", loadEventData);
}