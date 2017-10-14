<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210739_rbac_auth_item extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%rbac_auth_item}}',
            [
                'name'=> $this->string(64)->notNull(),
                'type'=> $this->integer(11)->notNull(),
                'description'=> $this->text()->null()->defaultValue(null),
                'rule_name'=> $this->string(64)->null()->defaultValue(null),
                'data'=> $this->text()->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('rule_name','{{%rbac_auth_item}}','rule_name',false);
        $this->createIndex('idx-auth_item-type','{{%rbac_auth_item}}','type',false);
    }

    public function safeDown()
    {
        $this->dropIndex('rule_name', '{{%rbac_auth_item}}');
        $this->dropIndex('idx-auth_item-type', '{{%rbac_auth_item}}');
        $this->dropTable('{{%rbac_auth_item}}');
    }
}
