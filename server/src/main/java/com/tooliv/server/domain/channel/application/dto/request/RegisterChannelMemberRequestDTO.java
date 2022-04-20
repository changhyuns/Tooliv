package com.tooliv.server.domain.channel.application.dto.request;

import com.tooliv.server.domain.channel.domain.enums.ChannelCode;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@ApiModel("RegisterChannelMemberRequestDTO")
@NoArgsConstructor
@Getter
public class RegisterChannelMemberRequestDTO {

    @NotNull
    @ApiModelProperty(name = "채널ID")
    private String channelId;

    @NotNull
    @ApiModelProperty(name = "email")
    private String email;

}