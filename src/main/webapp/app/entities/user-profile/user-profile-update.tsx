import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IChannel } from 'app/shared/model/channel.model';
import { getEntities as getChannels } from 'app/entities/channel/channel.reducer';
import { IDirectMessage } from 'app/shared/model/direct-message.model';
import { getEntities as getDirectMessages } from 'app/entities/direct-message/direct-message.reducer';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { getEntity, updateEntity, createEntity, reset } from './user-profile.reducer';

export const UserProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const channels = useAppSelector(state => state.channel.entities);
  const directMessages = useAppSelector(state => state.directMessage.entities);
  const userProfileEntity = useAppSelector(state => state.userProfile.entity);
  const loading = useAppSelector(state => state.userProfile.loading);
  const updating = useAppSelector(state => state.userProfile.updating);
  const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);

  const handleClose = () => {
    navigate('/user-profile');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
    dispatch(getChannels({}));
    dispatch(getDirectMessages({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...userProfileEntity,
      ...values,
      channels: mapIdList(values.channels),
      user: users.find(it => it.id.toString() === values.user.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...userProfileEntity,
          user: userProfileEntity?.user?.id,
          channels: userProfileEntity?.channels?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jiveApp.userProfile.home.createOrEditLabel" data-cy="UserProfileCreateUpdateHeading">
            <Translate contentKey="jiveApp.userProfile.home.createOrEditLabel">Create or edit a UserProfile</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="user-profile-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('jiveApp.userProfile.displayName')}
                id="user-profile-displayName"
                name="displayName"
                data-cy="displayName"
                type="text"
              />
              <ValidatedBlobField
                label={translate('jiveApp.userProfile.profileImage')}
                id="user-profile-profileImage"
                name="profileImage"
                data-cy="profileImage"
                isImage
                accept="image/*"
              />
              <ValidatedField id="user-profile-user" name="user" data-cy="user" label={translate('jiveApp.userProfile.user')} type="select">
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('jiveApp.userProfile.channel')}
                id="user-profile-channel"
                data-cy="channel"
                type="select"
                multiple
                name="channels"
              >
                <option value="" key="0" />
                {channels
                  ? channels.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/user-profile" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserProfileUpdate;
